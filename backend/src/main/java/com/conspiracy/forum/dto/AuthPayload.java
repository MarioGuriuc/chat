package com.conspiracy.forum.dto;

import com.conspiracy.forum.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthPayload {
    private User user;
    private String token;
}
