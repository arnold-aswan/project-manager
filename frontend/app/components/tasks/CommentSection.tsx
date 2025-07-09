import type { Comment, ProjectMemberRole, User } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "@/assets/icons";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
	useAddCommentMutation,
	useGetCommentsByTaskIdQuery,
} from "@/hooks/useTasks";

const CommentSection = ({
	projectMembers,
	taskId,
}: {
	projectMembers: { user: User; role: ProjectMemberRole };
	taskId: string;
}) => {
	const [newComment, setNewComment] = useState("");

	const { mutate: addComment, isPending } = useAddCommentMutation();
	const { data, isPending: isLoadingComments } = useGetCommentsByTaskIdQuery(
		taskId
	) as {
		data: Comment[];
		isPending: boolean;
	};

	const handleAddComment = () => {
		if (!newComment.trim() || newComment.trim().length < 3) {
			toast("Comments needs to be at least 4 characters long.");
			return;
		}

		addComment(
			{ taskId, text: newComment },
			{
				onSuccess: (data: any) => {
					setNewComment("");
					toast.success(data.message);
				},
				onError: (error: any) => {
					toast.error("Failed to add comment.");
					console.error(error);
				},
			}
		);
	};

	if (isLoadingComments)
		return (
			<div className="w-full flex items-center justify-center">
				<Loader2 className="size-10 text-blue-500 animate-spin " />
			</div>
		);

	return (
		<div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
			<h3 className="text-lg font-medium">Comments</h3>

			<ScrollArea className="h-full max-h-[20rem]">
				{data?.length > 0 ? (
					data?.map((comment) => (
						<div
							key={comment._id}
							className="flex gap-4 py-2"
						>
							<Avatar className="size-8">
								<AvatarImage src={comment?.author.avatar} />
								<AvatarFallback className="flex items-center justify-center">
									{comment.author.fullname.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1">
								<div className="flex justify-between items-center mb-1">
									<span className="font-medium text-sm">
										{comment.author.fullname}
									</span>

									<span className="text-xs text-muted-foreground">
										{formatDistanceToNow(comment.createdAt, {
											addSuffix: true,
										})}
									</span>
								</div>

								<p className="text-sm text-muted-foreground">{comment.text}</p>
							</div>
						</div>
					))
				) : (
					<div className="flex items-center justify-center py-8">
						<p className="text-sm text-muted-foreground">No comment yet</p>
					</div>
				)}
			</ScrollArea>

			<div>
				<Textarea
					placeholder="Add a comment"
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
				/>

				<div className="flex justify-end mt-4">
					<Button
						disabled={!newComment.trim() || isPending}
						onClick={handleAddComment}
					>
						Add Comment
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CommentSection;
