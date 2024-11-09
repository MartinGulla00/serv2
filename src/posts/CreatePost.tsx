import { useState } from 'react';
import ImageDropzone from '../inputs/ImageDropzone';
import { TextInput } from '../inputs/TextInput';
import { supabase } from '../supabase/supabaseClient';

export const CreatePost = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isCreateing, setIsCreating] = useState(false);

  const handleCreatePost = async () => {
    setIsCreating(true);
    if (!image) {
      alert('Please upload an image');
      setIsCreating(false);
      return;
    }
    if (!description) {
      alert('Please enter a description');
      setIsCreating(false);
      return;
    }
    const randomName = Math.random().toString(36).substring(6);
    await supabase.storage
      .from('images')
      .upload(`posts/${randomName}`, image)
      .catch((err) => {
        console.log(err);
        setIsCreating(false);
      });
    if (!isCreateing) {
      return;
    }
    supabase
      .from('posts')
      .insert({ description, image_url: `posts/${randomName}` })
      .then((res) => {
        console.log(res);
        setDescription('');
        setImage(null);
        setIsCreating(false);
      });
  };
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <ImageDropzone
        onImageUpload={(file) => setImage(file)}
        setError={() => {}}
        image={image}
      />
      {image && (
        <button onClick={() => setImage(null)}>
          (If you want to remove the image, click here)
        </button>
      )}
      <TextInput
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        label="Description"
        type="text-area"
        placeholder=""
      />
      <button onClick={handleCreatePost} disabled={isCreateing}>
        Submit
      </button>
    </div>
  );
};
