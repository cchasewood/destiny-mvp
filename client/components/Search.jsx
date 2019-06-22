import React from 'react';
import $ from 'jquery'

const findGuardian = (e) => {
  e.preventDefault();
  $.ajax({
    method: 'POST',
    url: `http://${window.location.hostname}:5252/search`,
    data: { displayName: $('#displayName').val() },
    success: (data) => console.log(data)
  })
}
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
