import React from 'react';
import 'whatwg-fetch';
import SearchBar from './SearchBar';
import ReposList from './ReposList';
import github from './api/github';
import  { getKeyFromStorage, setKeyInStorage} from './storage';

class App extends React.Component {
    state = { isLoading: true,
              token: '',
              loginError: '',
              registerError: '',
              loginEmail:'',
              loginPassword:'',
              registerName:'',
              registerEmail:'',
              registerPassword:'',
              registerPassword2:'',
              repos : []

    }
    
    
    componentDidMount() {
        const obj = getKeyFromStorage('the-main-app');
        if (obj && obj.token) {
            
            const { token} = obj;
            //verify token 
            fetch('/api/users/verify?token=' + token)
               .then(res => res.json())
               .then(json => {
                    if (json.success){
                       this.setState ({ token, isLoading: false})
                    }else {
                       this.setState ({ isLoading: false });
                    }
                })
        }else {
        this.setState({
            isLoading: false
          });
        }
    }
    
    // On search submit
    onSearchSubmit = async term => {
        const response = await github.get( '/search/repositories', {
            params: { 
                q: term
            }
        });
        this.setState({
            repos: response.data.items,   
              });
    }

    // set value of all fields (email,password) in Login && Register
    onChangeFieldLoginEmail = (event) => {
        this.setState({ loginEmail: event.target.value })
    }
    onChangeFieldLoginPassword = (event) => {
        this.setState({ loginPassword: event.target.value })
    }
    onChangeFieldRegisterName = (event) => {
        this.setState({ registerName: event.target.value })
    }
    onChangeFieldRegisterEmail = (event) => {
        this.setState({ registerEmail: event.target.value })
    }
    onChangeFieldRegisterPassword = (event) => {
        this.setState({ registerPassword: event.target.value })
    }
    onChangeFieldRegisterPassword2 = (event) => {
        this.setState({ registerPassword2: event.target.value })
    }

    onRegister = () => {
        //Grab state 
        const { registerName, registerEmail, registerPassword, registerPassword2 } = this.state;
        
        // Post Request to backend
        fetch ('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                name: registerName,
                email: registerEmail,
                password: registerPassword,
                password2: registerPassword2
            }),
        }).then(res =>res.json())
            .then(json => {
                if (json.success) {
                    this.setState({
                        registerError: json.msg,
                        name: '',
                        email: '',
                        password: '',
                        password2: '',
                        isLoading: false
                    });
                }
                else {
                    this.setState({
                        registerError: json.msg,
                        name: '',
                        email: '',
                        password: '',
                        password2: '',
                        isLoading: false
                    });
                }
               
          });
    }

    onLogin = () => {
        //Grab state 
        const { loginEmail, loginPassword } = this.state; 
        // Post Request to backend
        
        fetch ("/api/users/login", {
            headers: {
                'Content-Type': 'application/json',
            }, 
            method: 'POST',
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword,
            }),
        }).then(res =>res.json())
            .then(json => {
                if (json.success) {
                    setKeyInStorage('the_main_app', { token: json.token });
                    this.setState({
                        loginError: json.msg,
                        isLaoding: false,
                        loginPassword: '',
                        loginEmail: '',
                        token: json.token
                    });
                }
                else {
                    this.setState({
                        loginError: json.msg,
                        isLaoding: false
                    });
                }
               
          }).catch( err => {console.log(err)});
        
    }

    render() {
        const { isLoading,
                token,
                loginError,
                registerError,
                loginEmail,
                loginPassword,
                registerName,
                registerEmail,
                registerPassword, 
                registerPassword2 } = this.state
        if (isLoading) {
            return  (<div><p>Loading ...</p></div>) 
            }
        if (!token) {
            return  (<div>
                        <div> 
                           {
                               (loginError) ? (<p>{loginError}</p>):(null)
                           }
                           <h2>Login Form</h2>
                           <input type="email" placeholder="email" value={loginEmail} 
                                  onChange={this.onChangeFieldLoginEmail}/><br />
                           <input type="password" placeholder="password" value={loginPassword} 
                                  onChange={this.onChangeFieldLoginPassword}/><br />
                           <button onClick={this.onLogin}>Login</button>
                        </div>
                        <br />
                        <br />

                        <div>
                           {
                               (registerError) ? (<p>{registerError}</p>):(null)
                           }
                           <h2>register Form</h2>
                           <input type="text" placeholder="name" value={registerName} 
                                  onChange={this.onChangeFieldRegisterName}/>  
                           <input type="email" placeholder="email" value={registerEmail} 
                                  onChange={this.onChangeFieldRegisterEmail}/>   
                           <input type="text" placeholder="password" value={registerPassword} 
                                  onChange={this.onChangeFieldRegisterPassword}/> 
                           <input type="text" placeholder="password" value={registerPassword2} 
                                  onChange={this.onChangeFieldRegisterPassword2}/> 
                           <button onClick={this.onRegister}>Register</button>
                        </div>
                     </div>  
                    )
            }
        return ( <div>
                    <SearchBar onSubmittingSearch={this.onSearchSubmit} />
                    <div className="ui grid">
                        <div className="ui row">                       
                            <div className="column">
                                <ReposList reposList={this.state.repos} />
                            </div>
                        </div>
                    </div>  
                 </div>
                )
    }
}

export default App;