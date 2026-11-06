package com.blackcat.text.controller

import com.blackcat.text.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    data class RegisterRequest(val username: String, val email: String, val password: String)
    data class LoginRequest(val username: String, val password: String)

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<Any> {
        return try {
            authService.register(request.username, request.email, request.password)
            ResponseEntity.ok(mapOf("message" to "Đăng ký thành công"))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        return try {
            val user = authService.authenticate(request.username, request.password)
            ResponseEntity.ok(mapOf("message" to "Đăng nhập thành công", "username" to user.username))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }
}