import React from 'react';

import './EndorsersList.css';

function EndorsersList(props) {

    const listEndorsers = props.endorsers.reverse().map((endorser) =>
        <EndorserIcon key={endorser.name} value={endorser}/>
    );

    return <ul aria-label="endorsers-list" className="endorsersList">{listEndorsers}</ul>;
}

function EndorserIcon(props) {
    var PP = "data:image/png;base64," + props.value.image;
    var name = props.value.name;
    const [hover, setHover] = React.useState(false);

    const handleMouseHover =()=> {
        setHover(!hover);
    }


    return <li className="endorser" onMouseEnter={handleMouseHover} onMouseLeave={handleMouseHover} >
               <img className="endorserProfilePicture" src={PP} />
               {hover && <label className="endorserName">{name}</label>}
           </li>
}

export default EndorsersList;
