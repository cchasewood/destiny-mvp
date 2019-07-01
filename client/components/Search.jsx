import React from 'react';
import $ from 'jquery'

const searchStyle = {
  width: '100%'
}

const Search = (props) => {
  return (
    <div id="search-container" style={searchStyle}>
      <form>
        <input type='text' id='displayName' placeholder="Enter Profile Name" />
        <input type="submit" value="Find Guardian" onClick={props.findGuardian} />
      </form>
    </div>
  );
};

export default Search;
