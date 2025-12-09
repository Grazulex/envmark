<?php

use App\Http\Controllers\Api\EnvironmentController;
use App\Http\Controllers\Api\ProjectController;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::post('/projects/register', [ProjectController::class, 'register']);

// Protected routes (require project authentication)
Route::middleware('project.auth')->group(function () {
    // Project management
    Route::get('/projects/{uuid}', [ProjectController::class, 'show']);
    Route::delete('/projects/{uuid}', [ProjectController::class, 'destroy']);
    Route::put('/projects/{uuid}/password', [ProjectController::class, 'updatePassword']);

    // Environment management
    Route::get('/projects/{uuid}/environments', [EnvironmentController::class, 'index']);
    Route::post('/projects/{uuid}/environments/{environment}', [EnvironmentController::class, 'store']);
    Route::get('/projects/{uuid}/environments/{environment}', [EnvironmentController::class, 'show']);
    Route::get('/projects/{uuid}/environments/{environment}/history', [EnvironmentController::class, 'history']);
    Route::get('/projects/{uuid}/diff', [EnvironmentController::class, 'diff']);
});
