<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;

class AuditLog extends Model
{
    public const ACTION_REGISTER = 'register';
    public const ACTION_PUSH = 'push';
    public const ACTION_PULL = 'pull';
    public const ACTION_DELETE = 'delete';
    public const ACTION_PASSWORD_CHANGE = 'password_change';
    public const ACTION_LIST = 'list';

    protected $fillable = [
        'project_id',
        'action',
        'environment',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public static function log(
        Project $project,
        string $action,
        ?string $environment = null,
        ?Request $request = null,
        array $metadata = []
    ): static {
        return static::create([
            'project_id' => $project->id,
            'action' => $action,
            'environment' => $environment,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'metadata' => $metadata ?: null,
        ]);
    }

    public function scopeForAction($query, string $action)
    {
        return $query->where('action', $action);
    }
}
