import './App.css';
import {Layout, Row, Col, Button, Select, Collapse} from 'antd';
import { RightCircleFilled, CopyFilled, CloseCircleFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {UnControlled as CodeMirror} from 'react-codemirror2';
require('codemirror/mode/clike/clike');
require('codemirror/mode/python/python');
const {Header, Footer, Content} = Layout;
const {Option} = Select;
const {Panel} = Collapse;

const modes = [
  {
    text: 'C',
    value: 'c',
    mode: 'clike',
    code: `
#include <stdio.h>
int main() {
    printf("Hello World!");
}`.trim()
  },
  {
    text: 'C++',
    value: 'cpp',
    mode: 'clike',
    code: `
#include <iostream>
using namespace std;
int main() {
  cout<<"Hello World!";
}`.trim()
  },
  {
    text: 'Python',
    value: 'python2',
    mode: 'python',
    code: `print("Hello World!")`
  },
  {
    text: 'Java',
    value: 'java',
    mode: 'text/x-java',
    code: `
public class Main {
  public static void main(String args[]) {
      System.out.println("Hello World!");
  }
}`.trim()
  },
]

const themes = [
  {
    text: 'Ambiance',
    value: 'ambiance'
  },
  {
    text: 'Dracula',
    value: 'dracula'
  },
  {
    text: 'Duotone Dark',
    value: 'duotone-dark'
  },
  {
    text: 'Material',
    value: 'material'
  },
  {
    text: 'Midnight',
    value: 'midnight'
  },
  {
    text: 'The Matrix',
    value: 'the-matrix'
  },
  {
    text: 'Twilight',
    value: 'twilight'
  },
]

function App() {
  const [mode, setMode] = useState(modes.find((mode) => mode.value === 'cpp'));
  const [theme, setTheme] = useState(themes.find((theme) => theme.value === 'material'));
  const [code, setCode] = useState(mode.code);
  const [outputOpened, setOutputOpened] = useState(false);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setCode(mode.code)
  }, [mode])

  const runCode = async () => {
    try {
      setLoading(true)
      const {data:{output}} = await axios.post('https://rocky-lake-23379.herokuapp.com/https://api.jdoodle.com/v1/execute', 
      {
        "clientId":"57a595fb66b8f5823bc1cf206b3ea310",
        "clientSecret":"15f20a91e80b33d6f368234ded97f496616f9dafebd7a2d18e3afb9ee75c95a2",
        "script": code,
        "language": mode.value,
        "versionIndex":0
      })
      setOutput(output)
      setOutputOpened(true)
      setLoading(false)
    } catch(err){
      setLoading(false)
      console.log(err)
    }
  }
  
  return (
    <div className="App">
      <Layout>
        <Header style={{padding: '0px 20px'}}>
          <Row gutter={[16, 16]}>
            <Col>
              <Button loading={loading} onClick={runCode} icon={<RightCircleFilled />} type="primary" danger>
                Run
              </Button>
            </Col>
            <Col>
              <Select defaultValue={mode.value} value={mode.value} style={{ width: 120 }} onChange={(value) => setMode(modes.find((mode) => mode.value === value))}>
                {modes.map((mode) => <Option key={mode.value} value={mode.value}>{mode.text}</Option>)}
              </Select>
            </Col>
            <Col>
              <Select defaultValue={theme.value} value={theme.value} style={{ width: 120 }} onChange={(value) => setTheme(themes.find((theme) => theme.value === value))}>
                {themes.map((theme) => <Option key={theme.value} value={theme.value}>{theme.text}</Option>)}
              </Select>
            </Col>
            <Col>
              <Button icon={<CopyFilled style={{color: "#ff4d4f"}}/>} type="link" href={`/`} target="_blank" style={{color: '#fff'}}>New</Button>
            </Col>
            <Col>
              <Button onClick={() => setCode('')} icon={<CloseCircleFilled style={{color: "#ff4d4f"}}/>} type="link" style={{color: '#fff'}}>Clear</Button>
            </Col>
          </Row>
        </Header>
        <Content>
        <CodeMirror
          value={code}
          options={{
            mode: mode.mode,
            theme: theme.value,
            lineNumbers: true
          }}
          onChange={(editor, data, value) => {
            setCode(value)
          }}
        />
        </Content>
        <Footer style={{padding: '0px', background: 'rgb(0, 21, 41)'}}>
          <Collapse onChange={() => setOutputOpened(!outputOpened)} activeKey={outputOpened ? 1 : 0} style={{background: 'rgb(0, 21, 41)', border: 'none', color: 'rgb(255, 255, 255)'}}>
            <Panel header="Output" key={1}>
              <p>{output}</p>
            </Panel>
          </Collapse>
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
