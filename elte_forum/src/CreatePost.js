import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState("");
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('post');
  const [category, setCategory] = useState(1);
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const storedUserid = localStorage.getItem("loggedInUserid");
  const quillRef = useRef();
  const navigate = useNavigate();


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
          setErrorMsg('Error uploading image:', error);
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

  useEffect(() => {
    if (postType === "post") {
      Axios.get('http://localhost:3001/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        setErrorMsg('Error fetching categories:', error);
      });
    } else if (postType === "market") {
      Axios.get('http://localhost:3001/market_categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        setErrorMsg('Error fetching categories:', error);
      });
    }

  }, [postType]);

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
    if (postType === "post"){
      Axios.post('http://localhost:3001/createPost', {
        title: title,
        content: content,
        category: category,
        user_id: storedUserid,
      })
        .then((response) => {
          sessionStorage.setItem('selectedCategory', "my-posts");
          sessionStorage.setItem('sortBy', "newest");
          sessionStorage.setItem('pageNumber', 0);
          navigate("/");
        })
        .catch((error) => {
          setErrorMsg('Error creating post:', error);
        });
    } else if (postType === "market") {
      Axios.post('http://localhost:3001/market_createPost', {
        title: title,
        price: price,
        content: content,
        category: category,
        user_id: storedUserid,
      })
        .then((response) => {
          sessionStorage.setItem('market_selectedCategory', "my-posts");
          sessionStorage.setItem('market_sortBy', "newest");
          sessionStorage.setItem('market_pageNumber', 0);
          navigate("/market");
        })
        .catch((error) => {
          setErrorMsg('Error creating post:', error);
        });
    }

  };

  return (
    <div className="create-post">
      <h2>Create a new post</h2>
      <div className='create-post-filter'>
        <div>
          <label>Type: </label>
          <select value={postType} onChange={(e) => setPostType(e.target.value)} className="sort-button">
            <option value="post">Post</option>
            <option value="market">Market</option>
          </select>
        </div>
        <div>
          <label>Category: </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="sort-button">
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title..." required value={title} onChange={(e) => setTitle(e.target.value)} />
        {postType === "market" && (
          <>
            <input type="number" placeholder="Price(HUF)..." required value={price} onChange={(e) => setPrice(e.target.value)} />
          </>
        )}
        <div className="quill-box">
          <ReactQuill theme="snow" placeholder="Content..." value={content} onChange={setContent} modules={modules} ref={quillRef} />
        </div>
        <button type="submit" className='setting-button'>Create Post</button>
      </form>
      {errorMsg && (
        <div className='error-msg'>
          <h3>{errorMsg}</h3>
        </div>
      )}
    </div>
  );
};

export default CreatePost;