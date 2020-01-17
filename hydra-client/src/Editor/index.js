import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import ReactMarkdownEditor from "react-mde";
import { useArticle } from "../Article/hook";
import { HeaderWithUser } from "../Components/Header/HeaderWithUser";
import { Container, Button, Form, Row, Col } from "reactstrap";
import { GrantPanel } from "../Components/Grants/GrantPanel";

function WrappedMDE({ id, startingValue, save, grants, owner }) {
  const [data, updateData] = useState(startingValue);
  const [selectedTab, setSelectedTab] = React.useState("write");
  const render = markdown =>
    Promise.resolve(<ReactMarkdown source={markdown} />);

  const isNew = (id === 'new');

  async function onSave(e) {
    e.preventDefault();
    await save(data);
  }

  return (
    <div className="editor">
      <HeaderWithUser />
      <Container className="mt-3">
        <Row>
          <Col sm="9">
            <Form onSubmit={onSave}>
              <Row className="mb-2">
                <Col>
                  <Button color="success">
                    {isNew ? 'Create' : 'Update'}
                  </Button>
                </Col>
                {owner && <Col className="text-right">
                  Created by: {owner}
                </Col>}
              </Row>
              <ReactMarkdownEditor
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={render}
                onChange={updateData}
                value={data}
              />
            </Form>
          </Col>
          <Col sm="3">
            {!isNew && <GrantPanel
              grants={grants} 
            />}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export function Editor() {

  const doc = useArticle();
  const {loading, article, save} = doc;

  if (loading === true || article === null) {
    return (
      <div className="editor">
        <div className="loading">Loading</div>
      </div>
    );
  }

  return <WrappedMDE 
    startingValue={article.data} 
    id={article.id} 
    grants={article.grants} 
    save={save}
    owner={article.owner}
  />;
}
