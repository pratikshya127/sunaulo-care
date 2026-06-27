<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVoiceMessageRequest;
use App\Http\Resources\VoiceMessageResource;
use App\Models\Notification;
use App\Models\VoiceMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VoiceMessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId   = $request->user()->id;
        $messages = VoiceMessage::with(['sender', 'receiver'])
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
            })
            ->latest()
            ->paginate(20);

        return response()->json(['data' => VoiceMessageResource::collection($messages)]);
    }

    public function store(StoreVoiceMessageRequest $request): JsonResponse
    {
        $file     = $request->file('audio');
        $path     = $file->store('voice_messages', 'public');
        $duration = $request->input('duration', 0);

        $message = VoiceMessage::create([
            'sender_id'   => $request->user()->id,
            'receiver_id' => $request->input('receiver_id'),
            'audio_file'  => $path,
            'duration'    => $duration,
        ]);

        // Notify receiver
        Notification::create([
            'receiver_id' => $request->input('receiver_id'),
            'title'       => 'New Voice Message 🎙',
            'message'     => $request->user()->name . ' sent you a voice message.',
            'type'        => 'voice_message',
            'read'        => false,
        ]);

        return response()->json(['data' => new VoiceMessageResource($message->load(['sender', 'receiver']))], 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $message = VoiceMessage::where('sender_id', $request->user()->id)->findOrFail($id);
        Storage::disk('public')->delete($message->audio_file);
        $message->delete();

        return response()->json(['message' => 'Voice message deleted.']);
    }

    public function download(int $id): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $message = VoiceMessage::findOrFail($id);
        $path    = Storage::disk('public')->path($message->audio_file);

        return response()->download($path);
    }
}
