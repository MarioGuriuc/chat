package com.conspiracy.forum.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "theories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Theory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TheoryStatus status = TheoryStatus.UNVERIFIED;
    
    @ElementCollection
    @CollectionTable(name = "theory_evidence", joinColumns = @JoinColumn(name = "theory_id"))
    @Column(name = "evidence_url")
    private List<String> evidenceUrls = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @OneToMany(mappedBy = "theory", cascade = CascadeType.ALL)
    private List<Comment> comments = new ArrayList<>();
    
    @Column(nullable = false)
    private LocalDateTime postedAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        postedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public Integer getCommentCount() {
        return comments != null ? comments.size() : 0;
    }
}
