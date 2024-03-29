import React from 'react';


class SearchBar extends React.Component {
    state = {term: ''};   


    onFormSumbit = (event) => {
        event.preventDefault();
        this.props.onSubmittingSearch(this.state.term);
    }
    


    render() {
        return (
                <div className="search-bar ui segment">
                    <form className="ui form" onSubmit={this.onFormSumbit}>
                        <div className="field">
                            <label>Search top repositories in github: </label>
                            <input type="text" value={this.state.term} onChange={e => this.setState({term: e.target.value})} placeholder="search top repositories ..." />
                        </div>
                    </form>
                </div>
               
        );
    }

}
export default SearchBar;