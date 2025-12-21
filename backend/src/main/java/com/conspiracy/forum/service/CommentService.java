package com.conspiracy.forum.service;

import com.conspiracy.forum.dto.CommentInput;
import com.conspiracy.forum.model.Comment;
import com.conspiracy.forum.model.Theory;
import com.conspiracy.forum.model.User;
import com.conspiracy.forum.repository.CommentRepository;
import com.conspiracy.forum.repository.TheoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final TheoryRepository theoryRepository;
    
    @Transactional
    public Comment createComment(CommentInput input, User author) {
        if (input.getContent().length() < 3) {
            throw new RuntimeException("Comment must be at least 3 characters");
        }
        
        Theory theory = theoryRepository.findById(input.getTheoryId())
            .orElseThrow(() -> new RuntimeException("Theory not found"));
        
        Comment comment = new Comment();
        comment.setContent(input.getContent());
        comment.setTheory(theory);
        comment.setAuthor(author);
        
        return commentRepository.save(comment);
    }
    
    @Transactional
    public Comment updateComment(Long id, String content, Long userId) {
        if (content.length() < 3) {
            throw new RuntimeException("Comment must be at least 3 characters");
        }
        
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
            
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this comment");
        }
        
        comment.setContent(content);
        return commentRepository.save(comment);
    }
    
    @Transactional
    public boolean deleteComment(Long id, Long userId) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
            
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }
        
        commentRepository.delete(comment);
        return true;
    }
    
    public List<Comment> getCommentsByTheoryId(Long theoryId) {
        return commentRepository.findByTheoryId(theoryId);
    }
    
    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }
}
