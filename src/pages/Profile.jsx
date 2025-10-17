import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.get(`/users/${user.id}/posts`) // à créer si nécessaire
        .then(res => setPosts(res.data))
        .catch(() => alert("Impossible de charger vos posts"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <p className="text-center mt-10">Chargement du profil...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatarUrl || "https://i.pravatar.cc/100"}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-600 text-sm">{user.neuroType}</p>
        </div>
        <button className="ml-auto text-blue-600 hover:underline flex items-center gap-1 text-sm">
          <Pencil className="w-4 h-4" />
          Modifier
        </button>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-gray-700 text-sm mb-6 whitespace-pre-line">{user.bio}</p>
      )}

      {/* Posts */}
      <h3 className="text-lg font-semibold mb-3">Mes publications</h3>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">Aucun post pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-800">{post.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                Publié le {dayjs(post.createdAt).format("DD MMM YYYY à HH:mm")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}