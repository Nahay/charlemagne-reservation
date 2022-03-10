import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import FullScreenHeader from './FullScreenHeader';


class HeaderIcon extends React.Component {

    state = {
        clicked : false,
        matches: window.matchMedia("(min-width: 1300px)").matches
    }

    toggleClicked = () => this.setState({clicked:this.state.clicked ? false:true});

    componentDidMount() {
        const handler = e => {
            this.setState({matches: e.matches})
            // if menu is showed and width is above 1300/ height above 550, we close the menu
            if (this.state.matches && this.state.clicked) {
                this.setState({clicked: false})
            }
        };
        // matches = greater or equal to 1300 / 550
        window.matchMedia("(min-width: 1300px)").addEventListener('change', handler);
        window.matchMedia("(min-height: 550px)").addEventListener('change', handler);
    }
    

    render() { 
        return (
        <div>
            <div className = "header__icon">
                <span onClick={()=>this.toggleClicked()}>
                    { this.state.clicked ?
                        <FontAwesomeIcon icon = {faTimes}/>
                    :
                        <FontAwesomeIcon icon = {faBars} className = 'icon--bg'/>
                    }
                </span>
            </div>
            {this.state.clicked && <FullScreenHeader admin={this.props.admin} toggle = {this.toggleClicked}/>}
        </div>
        );
    }
}
 
export default HeaderIcon;