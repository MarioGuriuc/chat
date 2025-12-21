package com.conspiracy.forum.repository;

import com.conspiracy.forum.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTheoryId(Long theoryId);
    List<Comment> findByAuthorId(Long authorId);
}
