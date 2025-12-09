<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\EnvFile;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class EnvironmentController extends Controller
{
    public function index(Request $request, string $uuid): JsonResponse
    {
        $project = $request->attributes->get('project');

        $environments = $project->envFiles()
            ->selectRaw('environment, MAX(version) as latest_version, MAX(updated_at) as last_updated')
            ->groupBy('environment')
            ->get();

        AuditLog::log($project, AuditLog::ACTION_LIST, null, $request);

        return response()->json([
            'environments' => $environments,
        ]);
    }

    public function store(Request $request, string $uuid, string $environment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'encrypted_content' => 'required|string',
            'checksum' => 'required|string|size:64',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $project = $request->attributes->get('project');
        $version = EnvFile::getNextVersion($project->id, $environment);

        $envFile = EnvFile::create([
            'project_id' => $project->id,
            'environment' => $environment,
            'version' => $version,
            'encrypted_content' => $request->input('encrypted_content'),
            'checksum' => $request->input('checksum'),
        ]);

        AuditLog::log($project, AuditLog::ACTION_PUSH, $environment, $request, [
            'version' => $version,
        ]);

        return response()->json([
            'message' => 'Environment file pushed successfully',
            'environment' => $environment,
            'version' => $version,
            'created_at' => $envFile->created_at,
        ], Response::HTTP_CREATED);
    }

    public function show(Request $request, string $uuid, string $environment): JsonResponse
    {
        $project = $request->attributes->get('project');
        $version = $request->query('version');

        $query = $project->envFiles()->forEnvironment($environment);

        if ($version) {
            $envFile = $query->where('version', $version)->first();
        } else {
            $envFile = $query->latestVersion()->first();
        }

        if (!$envFile) {
            return response()->json([
                'error' => 'Environment not found',
                'message' => "No environment file found for '{$environment}'",
            ], Response::HTTP_NOT_FOUND);
        }

        AuditLog::log($project, AuditLog::ACTION_PULL, $environment, $request, [
            'version' => $envFile->version,
        ]);

        return response()->json([
            'environment' => $environment,
            'version' => $envFile->version,
            'encrypted_content' => $envFile->encrypted_content,
            'checksum' => $envFile->checksum,
            'created_at' => $envFile->created_at,
        ]);
    }

    public function history(Request $request, string $uuid, string $environment): JsonResponse
    {
        $project = $request->attributes->get('project');

        $history = $project->envFiles()
            ->forEnvironment($environment)
            ->latestVersion()
            ->select(['version', 'checksum', 'created_at'])
            ->get();

        return response()->json([
            'environment' => $environment,
            'history' => $history,
        ]);
    }

    public function diff(Request $request, string $uuid): JsonResponse
    {
        $project = $request->attributes->get('project');
        $from = $request->query('from');
        $to = $request->query('to');

        if (!$from || !$to) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Both "from" and "to" query parameters are required',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $fromEnv = $project->envFiles()
            ->forEnvironment($from)
            ->latestVersion()
            ->first();

        $toEnv = $project->envFiles()
            ->forEnvironment($to)
            ->latestVersion()
            ->first();

        return response()->json([
            'from' => $fromEnv ? [
                'environment' => $from,
                'version' => $fromEnv->version,
                'encrypted_content' => $fromEnv->encrypted_content,
                'checksum' => $fromEnv->checksum,
            ] : null,
            'to' => $toEnv ? [
                'environment' => $to,
                'version' => $toEnv->version,
                'encrypted_content' => $toEnv->encrypted_content,
                'checksum' => $toEnv->checksum,
            ] : null,
        ]);
    }
}
