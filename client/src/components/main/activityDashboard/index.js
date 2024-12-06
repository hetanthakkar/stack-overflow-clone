import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, User, LogIn, MessageSquare, Flag } from "lucide-react";
import { getLocalUser, getUser } from "../../../validation/helper";

const actionIcons = {
  Login: LogIn,
  "Posted Question": MessageSquare,
  "Commented on an Answer": MessageSquare,
  "Answered a Question": MessageSquare,
  "Flagged a Post": Flag,
  Logout: LogIn,
  "Posted Comment": MessageSquare,
  Upvoted: Flag,
  Downvoted: Flag,
};
const ActivityLog = () => {
  const [isModerator, setIsModerator] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserActivityLogs = async (targetUserId, page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/users/${targetUserId}/activity?page=${page}&limit=20`
      );

      setActivityLogs(response.data.activityLogs);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setSelectedUser({ userId: targetUserId });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching activity logs");
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersList = async () => {
    try {
      const { data } = await axios.post("/api/getUsers", { isModerator });
      setUsersList(data);
    } catch (err) {
      setError("Error fetching users list");
    }
  };

  const configure = async () => {
    let localUser = await getLocalUser();
    let username = localUser?.username;
    let user = await getUser(username);
    user = user?.data;
    await setIsModerator(user?.isModerator);
    await setUserId(user?._id);
  };

  useEffect(() => {
    const initialize = async () => {
      await configure();

      if (isModerator) {
        fetchUsersList();
      } else if (userId) {
        fetchUserActivityLogs(userId);
      }
    };

    initialize();
  }, [isModerator, userId]);

  const renderActivityLogItem = (log, index) => {
    const ActionIcon = actionIcons[log.action] || Clock;
    const formattedTimestamp = new Date(log.timestamp).toLocaleString();
    const handleLogItemClick = () => {
      navigate(`/question/${log.targetId?._id}`);
    };

    // Check if the log item is navigable
    const isNavigable =
      log.targetType === "Question" || // Questions
      log.action === "Answered a Question"; // Answers
    return (
      <div
        key={index}
        onClick={isNavigable ? handleLogItemClick : undefined}
        className={`flex items-center space-x-4 p-3 bg-white hover:bg-blue-50 rounded-xl transition-all duration-300 ease-in-out shadow-sm hover:shadow-md border-l-4 border-blue-500 ${
          isNavigable ? "cursor-pointer" : ""
        }`}
      >
        <ActionIcon className="text-blue-600 animate-pulse-slow" size={24} />
        <div className="flex-grow">
          <p className="text-sm font-semibold text-gray-800">
            {log.action}
            {isNavigable && (
              <span className="ml-2 text-xs text-blue-500">(View Details)</span>
            )}
          </p>
          <p className="text-xs text-gray-500">{formattedTimestamp}</p>
          {log.targetType && (
            <p className="text-xs text-gray-600 mt-1">
              <span className="font-medium text-blue-600">
                {log.targetType}:
              </span>{" "}
              {log.targetId?.title || log.targetId?.text || "N/A"}
            </p>
          )}
          {log.commentId && (
            <p className="mt-1 text-xs text-gray-500 italic">
              Comment: {log.commentId?.text || "N/A"}
            </p>
          )}
        </div>
      </div>
    );
  };
  const handlePageChange = (newPage) => {
    if (selectedUser) {
      fetchUserActivityLogs(selectedUser.userId, newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex items-center">
          <User className="mr-3" size={28} />
          <h1 className="text-2xl font-bold">
            {isModerator ? "Moderator Dashboard" : "User Dashboard"}
          </h1>
        </div>

        <div className="p-6">
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!isModerator && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Your Activity Log
              </h2>
              <div className="space-y-3">
                {activityLogs.map(renderActivityLogItem)}
              </div>
            </div>
          )}

          {isModerator && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                User Activity Logs
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {usersList.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => fetchUserActivityLogs(user.id)}
                    className="flex items-center justify-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    <User
                      className="mr-2 text-blue-600 group-hover:scale-110 transition-transform"
                      size={20}
                    />
                    <span className="text-sm text-gray-800 font-medium">
                      {user.username}
                    </span>
                  </button>
                ))}
              </div>

              {selectedUser && (
                <div>
                  <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Activity Log
                    </h3>
                    <div className="space-y-3">
                      {activityLogs.map(renderActivityLogItem)}
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-full transition-all duration-300 ${
                            currentPage === page
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-blue-50 border"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
