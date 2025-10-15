// src/pages/Feed.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PlusCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

dayjs.extend(relativeTime);

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [creating, setCreating] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(() => setError("Impossible de charger les posts."))
      .finally(() => setLoading(false));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    setCreating(true);
    api.post('/posts', {
      userId: user.id,
      content: newPostContent,
    })
      .then(() => {
        setShowModal(false);
        setNewPostContent('');
        fetchPosts(); // 🔄 Recharge les posts
      })
      .catch(() => alert("Erreur lors de la création du post."))
      .finally(() => setCreating(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <h1 className="text-xl font-bold mb-4 text-center">🧠 Fil d’actualité</h1>

      {/* 🔘 Bouton flottant pour ouvrir la modale */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center gap-1"
      >
        <PlusCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Nouveau post</span>
      </button>

      {/* 🔄 Loading */}
      {loading && <p className="text-center text-gray-500">Chargement...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* 📰 Liste des posts */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.author?.avatarUrl || 'https://i.pravatar.cc/40'}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">{post.author?.username || 'Anonyme'}</p>
                <p className="text-xs text-gray-500">{dayjs(post.createdAt).fromNow()}</p>
              </div>
            </div>

            <p className="text-gray-800 text-sm whitespace-pre-line">
              {post.content}
            </p>
          </div>
        ))}
      </div>

      {/* 💬 MODALE DE CRÉATION */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Créer un nouveau post</h2>

            <textarea
              rows="5"
              className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 text-sm"
              placeholder="Exprimez-vous..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              disabled={creating}
            />

            <button
              onClick={handleCreatePost}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              disabled={creating}
            >
              {creating ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
