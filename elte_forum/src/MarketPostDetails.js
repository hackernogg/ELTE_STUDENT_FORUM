import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useState, useMemo, useRef, useEffect } from "react";
import Axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const storedUsername = localStorage.getItem("loggedInUsername");
  const storedUserid = localStorage.getItem("loggedInUserid");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const navigate = useNavigate();

  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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
          setErrorMsg('Error uploading image:', error);
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
    Axios.get(`http://localhost:3001/market_posts/${id}`)
      .then((response) => {
        if (!response.data) {
          navigate("/");
        } else {
          setPost(response.data);
        }
      })
      .catch((error) => {
        setErrorMsg("Error fetching post:", error);
      });
  }, [id,navigate]);



  useEffect(() => {
    Axios.get(`http://localhost:3001/market_posts/${id}/replies`)
      .then((response) => {
        setReplies(response.data);
      })
      .catch((error) => {
        setErrorMsg("Error fetching replies:", error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the post to the server
    Axios.post(`http://localhost:3001/market_posts/${id}/replies`, {
      content: content,
      userId: storedUserid,
      userName: storedUsername
    })
      .then((response) => {
        window.location.reload()
      })
      .catch((error) => {
        setErrorMsg('Error creating post:', error);
      });
  };
  const handleRemovePost = (postId) => {
    // Send a request to the server to remove the post with the given postId and userId
    Axios.delete(`http://localhost:3001/market_posts/${postId}`)
      .then((response) => {
        // Handle any necessary update or refresh of the post list
        navigate("/market");
        
      })
      .catch((error) => {
        setErrorMsg('Error removing post:', error);
      });
  };

  const handleRemoveReply = (replyId) => {
    // Send a request to the server to remove the reply with the given replyId
    Axios.delete(`http://localhost:3001/market_replies/${replyId}`)
      .then((response) => {
        // Handle any necessary update or refresh of the replies list
        window.location.reload();
      })
      .catch((error) => {
        setErrorMsg('Error removing reply:', error);
      });
  };

  return (
    <div className="post-details">
      {post ? (
        <>
          <div className="post-box">
            <div className="post-user">
              <p className="user-box">{post.user_name}</p>
              <div className="post-remove">
                {( isAdmin || storedUserid === post.user_id ) && (
                  <button onClick={() => handleRemovePost(post.post_id)}>
                    ✘
                  </button>
                )}
                <p>{new Date(post.created_time).toLocaleString()}</p>
              </div>
            </div>
            <div className="post-content">
              <h2 className="title">{post.title}</h2>
              <h3>{post.price} HUF</h3>
              <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="quill-box">
              <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} ref={quillRef}/>
            </div>
            <button className="quill-submit" type="submit">Reply</button>
          </form>
          {errorMsg && (
          <div className='error-msg'>
            <h3>{errorMsg}</h3>
          </div>
          )}
        </>
      ) : (
        <div>Not Found</div>
      )}
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
          <div className="post-content" dangerouslySetInnerHTML={{ __html: reply.content }}></div>
        </div>
      ))}
    </div>
  );
};

export default PostDetails;