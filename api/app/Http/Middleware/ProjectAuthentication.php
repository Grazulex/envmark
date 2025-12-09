<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProjectAuthentication
{
    public function handle(Request $request, Closure $next): Response
    {
        $uuid = $request->header('X-Project-UUID');
        $authToken = $request->header('X-Project-Auth');

        if (empty($uuid) || empty($authToken)) {
            return response()->json([
                'error' => 'Missing authentication headers',
                'message' => 'X-Project-UUID and X-Project-Auth headers are required',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $project = Project::byUuid($uuid)->first();

        if (!$project) {
            return response()->json([
                'error' => 'Project not found',
                'message' => 'Invalid project UUID',
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (!$project->verifyPassword($authToken)) {
            return response()->json([
                'error' => 'Authentication failed',
                'message' => 'Invalid project password',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $request->attributes->set('project', $project);

        return $next($request);
    }
}
