import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react'

class App extends Component {
    state = {
        notes: [{
            id: 1,
            note: "Hello World"
        }]
    };

    render() {
        const { notes } = this.state;
        return (
            <div className="flex flex-column items-center justify-0center pa3 bg-washed-red">
                <h1 className="code f2-l">Amplify Notetaker</h1>

                {/*Note form*/}
                <form className="mb3">
                    <input type="text" className="pa2 f4" placeholder="Write your note"/>
                    <button className="pa2 f4" type="submit">Add Note</button>
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
