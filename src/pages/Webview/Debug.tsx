import React from 'react';

import { Button } from 'antd';

function onclick() {
  let messageData = {
    from: 'iframe',
    data: {
      command: 'onmessage',
      data: {
        type: 'command',
        content: 'open_file_picker',
      },
    },
  };
  window.parent.postMessage(messageData, '*');
}

class Debug extends React.Component {
  state = {
    path: 'null',
  };

  componentDidMount() {
    window.addEventListener('message', e => {
      console.log(e);
      let path = e.data.data.path;
      this.setState({
        path: path,
      });
    });
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={onclick}>
          Primary
        </Button>
        <p>path: {this.state.path}</p>
      </div>
    );
  }
}

export default Debug;
