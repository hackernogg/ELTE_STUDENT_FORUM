import { useState, useEffect } from 'react';
import BlogList from './BlogList';

const Home = () => {

    const [blogs, setBlogs] = useState([
        { title: 'My new website', body: 'lorem ipsum...', author: 'mario', id:1 },
        { title: 'Elte News', body: 'Nothing too much...', author: 'Jerry', id:2 },
        { title: 'Club day', body: 'Join us...', author: 'Jack', id:3 }
    ]);

    const [name, setName] = useState('mario');

    const handleDelete = (id) => {
        const newBlogs = blogs.filter(blog => blog.id != id);
        setBlogs(newBlogs);
    }

    useEffect(() => {
        console.log('use effect ran');
        console.log(name);
    },[name]);

    return ( 
        <div className="home">
            <BlogList blogs={blogs} title="All Blogs!" handleDelete={handleDelete} />
            <button onClick={() => setName('luigi')}>change name</button>
            <p>{ name }</p>
            <BlogList blogs={blogs.filter((blog)=>blog.author === 'mario')} title="Mario's Blogs!" handleDelete={handleDelete} />

        </div>
     );
}
 
export default Home;