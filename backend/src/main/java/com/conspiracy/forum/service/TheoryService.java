package com.conspiracy.forum.service;

import com.conspiracy.forum.dto.TheoryInput;
import com.conspiracy.forum.dto.TheoryPage;
import com.conspiracy.forum.exception.ResourceNotFoundException;
import com.conspiracy.forum.exception.UnauthorizedException;
import com.conspiracy.forum.exception.ValidationException;
import com.conspiracy.forum.model.Theory;
import com.conspiracy.forum.model.TheoryStatus;
import com.conspiracy.forum.model.User;
import com.conspiracy.forum.repository.TheoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TheoryService {
    private final TheoryRepository theoryRepository;
    
    public TheoryPage getTheories(Integer page, Integer size, TheoryStatus status, String keyword, Boolean hot) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("postedAt").descending());
        Page<Theory> theoryPage;
        
        if (hot != null && hot) {
            theoryPage = theoryRepository.findHotTheories(pageable);
        } else if (status != null && keyword != null && !keyword.isEmpty()) {
            theoryPage = theoryRepository.findByStatusAndKeyword(status, keyword, pageable);
        } else if (status != null) {
            theoryPage = theoryRepository.findByStatus(status, pageable);
        } else if (keyword != null && !keyword.isEmpty()) {
            theoryPage = theoryRepository.findByKeyword(keyword, pageable);
        } else {
            theoryPage = theoryRepository.findAll(pageable);
        }
        
        return new TheoryPage(
            theoryPage.getContent(),
            (int) theoryPage.getTotalElements(),
            theoryPage.getTotalPages(),
            theoryPage.getNumber(),
            theoryPage.getSize()
        );
    }
    
    public Optional<Theory> getTheoryById(Long id) {
        return theoryRepository.findById(id);
    }
    
    public List<Theory> getTheoriesByUserId(Long userId) {
        return theoryRepository.findByAuthorId(userId);
    }
    
    @Transactional
    public Theory createTheory(TheoryInput input, User author) {
        if (input.getTitle().length() < 5) {
            throw new ValidationException("Title must be at least 5 characters");
        }
        if (input.getContent().length() < 10) {
            throw new ValidationException("Content must be at least 10 characters");
        }
        
        Theory theory = new Theory();
        theory.setTitle(input.getTitle());
        theory.setContent(input.getContent());
        theory.setStatus(input.getStatus() != null ? input.getStatus() : TheoryStatus.UNVERIFIED);
        theory.setEvidenceUrls(input.getEvidenceUrls() != null ? input.getEvidenceUrls() : List.of());
        theory.setAuthor(author);
        
        return theoryRepository.save(theory);
    }
    
    @Transactional
    public Theory updateTheory(Long id, TheoryInput input, Long userId) {
        Theory theory = theoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Theory not found"));
            
        if (!theory.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized to update this theory");
        }
        
        if (input.getTitle().length() < 5) {
            throw new ValidationException("Title must be at least 5 characters");
        }
        if (input.getContent().length() < 10) {
            throw new ValidationException("Content must be at least 10 characters");
        }
        
        theory.setTitle(input.getTitle());
        theory.setContent(input.getContent());
        if (input.getStatus() != null) {
            theory.setStatus(input.getStatus());
        }
        if (input.getEvidenceUrls() != null) {
            theory.setEvidenceUrls(input.getEvidenceUrls());
        }
        
        return theoryRepository.save(theory);
    }
    
    @Transactional
    public boolean deleteTheory(Long id, Long userId) {
        Theory theory = theoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Theory not found"));
            
        if (!theory.getAuthor().getId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized to delete this theory");
        }
        
        theoryRepository.delete(theory);
        return true;
    }
}
