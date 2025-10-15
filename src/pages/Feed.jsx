// src/pages/Feed.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(() => setError("Impossible de charger les posts."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold mb-4 text-center">🧠 Fil d’actualité</h1>

      {loading && <p className="text-center text-gray-500">Chargement...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

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
    </div>
  );
}
