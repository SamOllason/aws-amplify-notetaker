import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react'
import { createNote } from './graphql/mutations';

class App extends Component {
    state = {
        note: '',
        notes: [{
            id: 1,
            note: "Hello World"
        }]
    };

    handleChangeNote = event => this.setState({ note: event.target.value });

    handleAddNote = async event => {
        // prevents the default action, which is to reload the page
        event.preventDefault();

        const { note, notes } = this.state;

        const input = { note };

        const result = await API.graphql(graphqlOperation(createNote, { input }));

        // use result from mutation to update UI
        const newNote = result.data.createNote;
        const updatedNotes = [newNote, ...notes];
        this.setState({notes: updatedNotes, note:''});
    };

    render() {
        const { notes, note } = this.state;
        return (
            <div className="flex flex-column items-center justify-0center pa3 bg-washed-red">
                <h1 className="code f2-l">Amplify Notetaker</h1>

                {/*Note form*/}
                <form className="mb3" onSubmit={this.handleAddNote}>
                    <input type="text"
                           className="pa2 f4"
                           placeholder="Write your note"
                           onChange={this.handleChangeNote}
                           value={note}
                    />
                    <button className="pa2 f4" type="submit">
                        Add Note
                    </button>
                </form>

                {/*Notes list*/}
                <div>
                    {notes.map(note => (
                        <div key={note.id} className="flex items-center">
                            <li className="list pa1 f3">
                                {note.note}
                            </li>
                            <button className="bg-transparent bn f4">&times;</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

}

export default withAuthenticator(App, { includeGreetings: true });
