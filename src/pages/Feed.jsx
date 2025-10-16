// src/pages/Feed.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PlusCircle, X, MessageCircle, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

dayjs.extend(relativeTime);

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);

  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    api.get('/posts')
      .then(res => {
        setPosts(res.data);
        // Récupère les posts déjà likés par l'utilisateur
        const liked = res.data
        .filter(p => p.isLikedByCurrentUser)
        .map(p => p.id);
      setLikedPosts(liked);
      })
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
        fetchPosts();
      })
      .catch(() => alert("Erreur lors de la création du post."))
      .finally(() => setCreating(false));
  };

  const handleCommentChange = (postId, value) => {
    setNewComments({ ...newComments, [postId]: value });
  };

  const handleAddComment = (postId) => {
    const content = newComments[postId]?.trim();
    if (!content) return;

    api.post('/comments', {
      userId: user.id,
      postId,
      content,
    })
      .then(() => fetchPosts())
      .catch(() => alert("Erreur lors de l’ajout du commentaire."));
  };

  const toggleLike = (postId) => {
    const alreadyLiked = likedPosts.includes(postId);
    const method = alreadyLiked ? 'delete' : 'post';

    api[method](`/likes/${postId}/user/${user.id}`)
      .then(() => {
        if (alreadyLiked) {
          setLikedPosts(likedPosts.filter(id => id !== postId));
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
        fetchPosts();
      })
      .catch(() => alert("Erreur lors de la mise à jour du like."));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <h1 className="text-xl font-bold mb-4 text-center">🧠 Fil d’actualité</h1>

      {/* Bouton nouveau post */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center gap-1"
      >
        <PlusCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Nouveau post</span>
      </button>

      {loading && <p className="text-center text-gray-500">Chargement...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-6">
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

            <p className="text-gray-800 text-sm whitespace-pre-line mb-3">
              {post.content}
            </p>

            {/* Like & commentaires */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1 ${likedPosts.includes(post.id) ? 'text-red-500' : 'hover:text-red-400'}`}
              >
                <Heart className="w-4 h-4" />
                {post.likeCount}
              </button>

              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.commentCount}
              </div>
            </div>

            {/* Liste des commentaires */}
            <div className="space-y-2 mt-2">
              {post.comments?.map(comment => (
                <div key={comment.id} className="text-sm bg-gray-100 p-2 rounded-md">
                  <span className="font-semibold">{comment.author.username} :</span>{' '}
                  {comment.content}
                </div>
              ))}
            </div>

            {/* Champ pour ajouter un commentaire */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Ajouter un commentaire..."
                className="flex-1 border p-2 rounded-md text-sm"
                value={newComments[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Publier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modale création post */}
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
