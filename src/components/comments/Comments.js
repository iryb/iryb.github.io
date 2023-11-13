import React, { useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import styles from "./styles.module.scss";
import UserAvatar from "@components/user-avatar/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getComments } from "@store/tasksSlice";
import { BsCursorFill } from "react-icons/bs";

export default function Comments({ taskId }) {
  const commentRef = useRef();
  const dispatch = useDispatch();

  const comments = useSelector((state) => {
    const taskIdx = state.tasks.tasksList.findIndex((t) => t.id === taskId);
    return state.tasks.tasksList[taskIdx].comments;
  });

  useEffect(() => {
    dispatch(getComments({ taskId }));
  }, []);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentRef.current.value) {
      dispatch(
        addComment({
          taskId: taskId,
          text: commentRef.current.value,
        })
      );

      commentRef.current.value = "";
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmitComment} className={styles.form}>
        <Form.Group>
          <Form.Control
            as="textarea"
            placeholder="Ask a question or post an update..."
            ref={commentRef}
            className={styles.textarea}
          />
        </Form.Group>
        <button type="submit" className={styles.submitButton}>
          <BsCursorFill />
        </button>
      </Form>
      {comments && (
        <div className={styles.comments}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.leftCol}>
                <UserAvatar
                  userName={comment.userName}
                  photo={comment.userPhoto}
                />
              </div>
              <div className={styles.rightCol}>
                <div className={styles.commentHeader}>
                  <span className={styles.userName}>{comment.userName}</span>
                  <span className={styles.date}>{comment.datetime}</span>
                </div>
                <div className={styles.text}>{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
