package com.blackcat.text.service

import com.blackcat.text.entity.User
import com.blackcat.text.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    fun register(username: String, email: String, password: String): User {
        if (userRepository.existsByUsername(username)) throw Exception("Username đã tồn tại")
        if (userRepository.existsByEmail(email)) throw Exception("Email đã tồn tại")

        val user = User(
            username = username,
            email = email,
            passwordHash = passwordEncoder.encode(password)!!,
            displayName = username
        )
        return userRepository.save(user)
    }

    fun authenticate(username: String, password: String): User {
        val user = userRepository.findByUsername(username)
            .orElseThrow { Exception("Sai username hoặc mật khẩu") }

        if (!passwordEncoder.matches(password, user.passwordHash)) {
            throw Exception("Sai username hoặc mật khẩu")
        }
        return user
    }
}