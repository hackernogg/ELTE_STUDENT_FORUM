import { useParams } from "react-router-dom";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  const storedUsername = localStorage.getItem("loggedInUsername");
  const storedUserid = localStorage.getItem("loggedInUserid");
  console.log(storedUsername);

  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState('');
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

  useEffect(() => {
    console.log(id);
    Axios.get(`http://localhost:3001/posts/${id}`)
      .then((response) => {
        setBlog(response.data);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);



  useEffect(() => {
    Axios.get(`http://localhost:3001/posts/${id}/replies`)
      .then((response) => {
        setReplies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching replies:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the post to the server
    Axios.post(`http://localhost:3001/posts/${id}/replies`, {
      content: content,
      userId: storedUserid,
      userName: storedUsername
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Error creating post:', error);
      });
  };

  return (
    <div className="blog-details">
      {blog ? (
        <>
          <h2>{blog.title}</h2>
          <p>Written by {blog.user_name}</p>
          <p>Created time {blog.created_time}</p>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </>
      ) : (
        <div>Loading...</div>
      )}
      <h3>Replies:</h3>
      {replies.map((reply) => (
        <div className="reply" key={reply.reply_id}>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: reply.content }}></div>
          <p>Written by {reply.user_name}</p>
          <p>Created time {reply.created_time}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <label>Reply:</label>
        <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} ref={quillRef} />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
};

export default BlogDetails;