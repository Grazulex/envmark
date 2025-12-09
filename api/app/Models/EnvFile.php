<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnvFile extends Model
{
    protected $fillable = [
        'project_id',
        'environment',
        'version',
        'encrypted_content',
        'checksum',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeForEnvironment($query, string $environment)
    {
        return $query->where('environment', $environment);
    }

    public function scopeLatestVersion($query)
    {
        return $query->orderBy('version', 'desc');
    }

    public static function getNextVersion(int $projectId, string $environment): int
    {
        $maxVersion = static::where('project_id', $projectId)
            ->where('environment', $environment)
            ->max('version');

        return ($maxVersion ?? 0) + 1;
    }
}
