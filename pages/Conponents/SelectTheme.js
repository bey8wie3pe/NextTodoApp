import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function SelectTheme() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        ドロップダウン
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">アクション1</Dropdown.Item>
        <Dropdown.Item href="#/action-2">アクション2</Dropdown.Item>
        <Dropdown.Item href="#/action-3">アクション3</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SelectTheme;
