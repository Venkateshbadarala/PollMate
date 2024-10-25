<div className="flex flex-col mt-8 bg-white w-full sm:w-[30rem] p-4 rounded-md x-sm:w-[26rem] sm:w-[32rem] lg:h-[35rem] shadow-lg">
      <h3 className="mb-4 text-lg font-bold">Comments:</h3>

      <div className="overflow-y-auto max-h-64 lg:max-h-[30rem]">
        {nestedComments.map((comment, index) => {
          const user = usersData[comment.userId] || {};
          const isCurrentUser = auth.currentUser && auth.currentUser.uid === comment.userId;

          return (
            <div
              key={index}
              className="p-3 mb-4 transition-shadow duration-300 bg-gray-100 rounded-lg hover:shadow-md"
            >
              <div className="flex items-center mb-2">
                <img
                  src={user.image || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-8 h-8 mr-2 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-bold">{user.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(
                      comment.timestamp instanceof Date
                        ? comment.timestamp
                        : comment.timestamp?.toDate?.() || new Date(comment.timestamp)
                    )}{" "}
                    ago
                  </p>
                </div>
                {isCurrentUser && (
                  <button
                    onClick={() => handleDeleteComment(comment.id, false)}
                    className="ml-auto text-red-500 transition-colors duration-200 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="break-words">{comment.text}</p>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 ml-8">
                  {comment.replies.map((reply, idx) => {
                    const replyUser = usersData[reply.userId] || {};
                    const isReplyCurrentUser = auth.currentUser && auth.currentUser.uid === reply.userId;

                    return (
                      <div key={idx} className="p-2 mb-2 rounded-lg shadow-sm bg-gray-50">
                        <div className="flex items-center mb-1">
                          <img
                            src={replyUser.image || "/default-avatar.png"}
                            alt="User Avatar"
                            className="w-6 h-6 mr-2 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-bold">{replyUser.name || "Anonymous"}</p>
                            <p className="text-xs text-gray-600">
                              {formatDistanceToNow(
                                reply.timestamp instanceof Date
                                  ? reply.timestamp
                                  : reply.timestamp?.toDate?.() || new Date(reply.timestamp)
                              )}{" "}
                              ago
                            </p>
                          </div>
                          {isReplyCurrentUser && (
                            <button
                              onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                              className="ml-auto text-red-500 transition-colors duration-200 hover:text-red-700"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="break-words">{reply.text}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {replyingToCommentId === comment.id ? (
                <div className="mt-4 w-full sm:w-[95%]">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2 mb-2 text-sm border rounded"
                    placeholder="Write a reply..."
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Reply
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingToCommentId(comment.id)}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  Reply
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center w-full mt-4">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 mr-2 border rounded"
          placeholder="Add a comment..."
          autoFocus
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>