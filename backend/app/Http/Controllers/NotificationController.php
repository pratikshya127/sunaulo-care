<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::where('receiver_id', $request->user()->id)
            ->latest()
            ->paginate(30);

        return response()->json([
            'data'   => NotificationResource::collection($notifications),
            'unread' => Notification::where('receiver_id', $request->user()->id)->where('read', false)->count(),
        ]);
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('receiver_id', $request->user()->id)->findOrFail($id);
        $notification->update(['read' => true]);

        return response()->json(['message' => 'Notification marked as read.']);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        Notification::where('receiver_id', $request->user()->id)->update(['read' => true]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        Notification::where('receiver_id', $request->user()->id)->findOrFail($id)->delete();

        return response()->json(['message' => 'Notification deleted.']);
    }
}
