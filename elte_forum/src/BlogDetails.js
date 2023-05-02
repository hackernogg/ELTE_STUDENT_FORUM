import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useState, useMemo, useRef, useEffect } from "react";
import Axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  const storedUsername = localStorage.getItem("loggedInUsername");
  const storedUserid = localStorage.getItem("loggedInUserid");
  const isAdmin = localStorage.getItem("isAdmin");

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
  const navigate = useNavigate();
  const handleRemovePost = (postId) => {
    // Send a request to the server to remove the post with the given postId and userId
    Axios.delete(`http://localhost:3001/posts/${postId}`)
      .then((response) => {
        console.log('Post removed successfully:', response);
        // Handle any necessary update or refresh of the blog list
        navigate(-1, { replace: true });
        
      })
      .catch((error) => {
        console.error('Error removing post:', error);
      });
  };

  const handleRemoveReply = (replyId) => {
    // Send a request to the server to remove the reply with the given replyId
    Axios.delete(`http://localhost:3001/replies/${replyId}`)
      .then((response) => {
        console.log('Reply removed successfully:', response);
        // Handle any necessary update or refresh of the replies list
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error removing reply:', error);
      });
  };

  return (
    <div className="blog-details">
      {blog ? (
        <>
          <div className="post-box">
            <div className="post-user">
              <p className="user-box">{blog.user_name}</p>
              <div className="post-remove">
                {(isAdmin || storedUserid === blog.user_id) && (
                  <button onClick={() => handleRemovePost(blog.post_id)}>
                    ✘
                  </button>
                )}
                <p>{new Date(blog.created_time).toLocaleString()}</p>
              </div>
            </div>
            <div className="blog-content">
              <h2>{blog.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="quill-box">
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} ref={quillRef}/>
        </div>
        <button className="quill-submit" type="submit" onClick={() => window.location.reload()}>Reply</button>
      </form>
      {replies.map((reply) => (
        <div className="reply" key={reply.reply_id}>
          <div className="reply-user">
            <p className="reply-user-box">{reply.user_name}</p>
            <div className="reply-remove">
              <p>{new Date(reply.created_time).toLocaleString()}</p>
              {(isAdmin||storedUserid === reply.user_id) && (
                  <button onClick={() => handleRemoveReply(reply.reply_id)}>
                    ✘
                  </button>
              )}
            </div>
          </div>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: reply.content }}></div>
        </div>
      ))}
    </div>
  );
};

export default BlogDetails;