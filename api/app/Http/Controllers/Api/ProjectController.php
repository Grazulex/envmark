<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ProjectController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $project = Project::create([
            'name' => $request->input('name'),
            'password_hash' => password_hash($request->input('password'), PASSWORD_BCRYPT),
        ]);

        AuditLog::log($project, AuditLog::ACTION_REGISTER, null, $request);

        return response()->json([
            'message' => 'Project registered successfully',
            'project' => [
                'uuid' => $project->uuid,
                'name' => $project->name,
                'created_at' => $project->created_at,
            ],
        ], Response::HTTP_CREATED);
    }

    public function show(Request $request, string $uuid): JsonResponse
    {
        $project = $request->attributes->get('project');

        return response()->json([
            'project' => [
                'uuid' => $project->uuid,
                'name' => $project->name,
                'created_at' => $project->created_at,
                'updated_at' => $project->updated_at,
            ],
        ]);
    }

    public function destroy(Request $request, string $uuid): JsonResponse
    {
        $project = $request->attributes->get('project');

        AuditLog::log($project, AuditLog::ACTION_DELETE, null, $request);

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully',
        ]);
    }

    public function updatePassword(Request $request, string $uuid): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'new_password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $project = $request->attributes->get('project');
        $project->password_hash = password_hash($request->input('new_password'), PASSWORD_BCRYPT);
        $project->save();

        AuditLog::log($project, AuditLog::ACTION_PASSWORD_CHANGE, null, $request);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }
}
