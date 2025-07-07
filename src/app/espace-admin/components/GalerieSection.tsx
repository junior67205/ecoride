'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalerieImage {
  galerie_id: number;
  nom_fichier: string;
  titre: string | null;
  description: string | null;
  ordre: number | null;
  actif: boolean;
}

export default function GalerieSection() {
  const [images, setImages] = useState<GalerieImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the upload form
  const [file, setFile] = useState<File | null>(null);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [ordre, setOrdre] = useState(0);
  const [uploading, setUploading] = useState(false);

  // State for editing
  const [editingImage, setEditingImage] = useState<GalerieImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/espace-admin/galerie');
      if (!response.ok) throw new Error('Erreur lors de la récupération des images');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('ordre', String(ordre));

    try {
      const response = await fetch('/api/espace-admin/galerie', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi de l'image");
      }

      // Reset form and refetch images
      setFile(null);
      setTitre('');
      setDescription('');
      setOrdre(0);
      fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      const response = await fetch(`/api/espace-admin/galerie/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setImages(images.filter(img => img.galerie_id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleEdit = (image: GalerieImage) => {
    setEditingImage({ ...image });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      const response = await fetch(`/api/espace-admin/galerie/${editingImage.galerie_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: editingImage.titre,
          description: editingImage.description,
          ordre: editingImage.ordre,
          actif: editingImage.actif,
        }),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      setEditingImage(null);
      fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (loading) return <p>Chargement de la galerie...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Gestion de la Galerie</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Ajouter une nouvelle image</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <input
            type="text"
            placeholder="Titre"
            value={titre}
            onChange={e => setTitre(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Ordre"
            value={ordre}
            onChange={e => setOrdre(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded"
          >
            {uploading ? 'Envoi en cours...' : 'Ajouter'}
          </button>
        </form>
      </div>

      {/* Image List */}
      <div className="space-y-4">
        {images.map(image => (
          <div
            key={image.galerie_id}
            className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4"
          >
            <Image
              src={`/uploads/${image.nom_fichier}`}
              alt={image.titre || ''}
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
            <div className="flex-grow">
              <h4 className="font-bold">{image.titre}</h4>
              <p className="text-sm text-gray-600">{image.description}</p>
              <p className="text-xs text-gray-500">
                Ordre: {image.ordre} | Actif: {image.actif ? 'Oui' : 'Non'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(image)}
                className="bg-primary hover:bg-primary-light text-white px-3 py-1 rounded text-sm"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(image.galerie_id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Modifier l&apos;image</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Titre"
                value={editingImage.titre || ''}
                onChange={e => setEditingImage({ ...editingImage, titre: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={editingImage.description || ''}
                onChange={e => setEditingImage({ ...editingImage, description: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Ordre"
                value={editingImage.ordre || 0}
                onChange={e =>
                  setEditingImage({ ...editingImage, ordre: parseInt(e.target.value) })
                }
                className="w-full p-2 border rounded"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingImage.actif}
                  onChange={e => setEditingImage({ ...editingImage, actif: e.target.checked })}
                />
                <label>Actif</label>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
