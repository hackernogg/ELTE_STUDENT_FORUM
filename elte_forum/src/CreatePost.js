import React, { useState, useMemo, useRef, useEffect } from 'react';
import Axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = ({ userId, userName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('post');
  const quillRef = useRef();


  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      Axios.post('http://localhost:3001/uploadImage', formData)
        .then((response) => {
          const url = response.data.url;
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', url);
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });
    };
    input.click();
  };
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.getModule('toolbar').addHandler('image', handleImageUpload);
    }
  }, [quillRef]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
          ['code-block'],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );


  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the post to the server
    Axios.post('http://localhost:3001/createPost', {
      title: title,
      content: content,
      postType: postType,
      user_id: userId,
      user_name: userName,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Error creating post:', error);
      });
  };

  return (
    <div className="create-post">
      <h2>Create a new post</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Content:</label>
        <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} ref={quillRef} />
        <label>Post Type:</label>
        <select value={postType} onChange={(e) => setPostType(e.target.value)}>
          <option value="post">Post</option>
          <option value="market">Market</option>
        </select>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;