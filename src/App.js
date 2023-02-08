import logo from './logo.svg';
import './App.css';
import React, {useState} from "react";



function Article(props){
  return(
      <article>
        <h2>{props.title}</h2>
        {props.body}
      </article>
  )
}
function Header(props){
    return(
        <header>
            <h1>
                <a href="/" onClick={(e)=>{
                    e.preventDefault();
                    props.onChangeMode();
                }
                }>{props.title}</a>
            </h1>
        </header>
    )
}
function Nav(props){
    const lis = [];
    props.topics.map((it)=>{
        lis.push(
            <li key={it.id}>
                <a id={it.id} href={`/read/${it.id}}`} onClick={e=>{
                    e.preventDefault();
                    props.onChangeMode(Number(it.id));
                }}>
                    {it.title}
                </a>
            </li>
        )
    })
    return(
        <nav>
            <ol>
                {lis}
            </ol>
        </nav>
    )
}
function Create(props){
    return(
        <article>
            <h2>Create</h2>
            <form onSubmit={event => {
                event.preventDefault();
                const title = event.target.title.value;
                const body = event.target.body.value;
                props.onCreate(title,body);
            }}>
                <p><input type="text" name="title" placeholder="title"/></p>
                <p><textarea name="body" placeholder="body"></textarea></p>
                <p><input type="submit" value="Create"/></p>
            </form>
        </article>
    )
}
function Update(props){
    const [title,setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    return(
        <article>
            <h2>Update</h2>
            <form onSubmit={event => {
                event.preventDefault();
                const title = event.target.title.value;
                const body = event.target.body.value;
                props.onUpdate(title,body);
            }}>
                <p><input type="text" name="title" placeholder="title" value={title} onChange={event => {
                    setTitle(event.target.value)
                }}/></p>
                <p><textarea name="body" placeholder="body" value={body} onChange={event => {
                    setBody(event.target.value)
                }}></textarea></p>
                <p><input type="submit" value="Update"/></p>
            </form>
        </article>
    )
}
function App() {
    const [mode, setMode] = useState('WELCOME');
    const [id, setId] = useState(null);
    const [nextId, setNextId] = useState(4);
    const [topic, setTopic] = useState([
        {id:1,title:'html',body:'html is...'},
        {id:2,title:'css',body:'css is...'},
        {id:3,title:'js',body:'js is...'},
    ]);
    let content = '';
    let contextControl = ''
    if(mode === 'WELCOME'){
        content = <Article title="Welcome" body="Hello, Web"/>
    }else if(mode === 'READ') {
        let title, body = '';
        for (let i = 0; i < topic.length; i++) {
            if(topic[i].id === id){
                title = topic[i].title;
                body = topic[i].body;
            }
        }
        content = <Article title={title} body={body}/>
        contextControl = <>
            <li>
                <a href={`/update/${id}`} onClick={event => {
                    event.preventDefault();
                    setMode('UPDATE')
                }}>Update</a>
            </li>
            <li>
                <input type="button" value="Delete" onClick={()=>{
                    const newTopics = [];
                    for (let i = 0; i < topic.length; i++) {
                        if(topic[i].id !== id){
                            newTopics.push(topic[i])
                        }
                    }
                    setTopic(newTopics);
                    setMode('WELCOME')
                }}/>
            </li>
        </>
    }else if(mode === 'CREATE'){
        content = <Create onCreate={(title, body)=>{
            const newTopic = {id:nextId ,title: title, body: body}
            const newTopics = [...topic];
            newTopics.push(newTopic);
            setTopic(newTopics);
            setMode('READ')
            setId(nextId)
            setNextId(nextId + 1)
        }}/>
    }else if (mode === 'UPDATE'){
        let title, body = '';
        for (let i = 0; i < topic.length; i++) {
            if(topic[i].id === id){
                title = topic[i].title;
                body = topic[i].body;
            }
        }
        content = <Update title={title} body={body} onUpdate={(title,body)=>{
            const newTopics = [...topic];
            const updateTopic = {id:id,title:title, body:body}
            for (let i = 0; i < newTopics.length; i++) {
                if(newTopics[i].id === id){
                    newTopics[i] = updateTopic;
                    break;
                }
            }
            setTopic(newTopics);
            setMode("READ");
        }}/>
    }
  return (
      <div>
          <Header title="REACT" onChangeMode={()=>{
                setMode('WELCOME');
          }}/>
          <Nav topics={topic} onChangeMode={(_id)=>{
              setMode('READ');
              setId(_id);
          }}/>
          {content}
          <ul>
              <li>
                  <a href="/create" onClick={(e)=>{
                      e.preventDefault();
                      setMode('CREATE')
                  }}>Create</a>
              </li>
              {contextControl}
          </ul>
      </div>
  );
}

export default App;
