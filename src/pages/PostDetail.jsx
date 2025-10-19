import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import dayjs from "dayjs";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => setError("Post introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-8 text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">🧠 Publication</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={post.authorAvatar || "https://i.pravatar.cc/40"}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{post.authorUsername}</p>
            <p className="text-xs text-gray-500">{dayjs(post.createdAt).format("DD MMM YYYY à HH:mm")}</p>
          </div>
        </div>

        <p className="text-gray-800 text-sm mb-4 whitespace-pre-line">
          {post.content}
        </p>

        <h3 className="text-sm font-semibold mb-2">Commentaires ({post.commentCount})</h3>
        <div className="space-y-2">
          {post.lastComments?.map(comment => (
            <div key={comment.id} className="bg-gray-100 p-2 rounded text-sm">
              <span className="font-medium">{comment.authorUsername} :</span> {comment.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
