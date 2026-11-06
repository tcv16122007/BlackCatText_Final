package com.blackcat.text.controller

import com.blackcat.text.entity.ChatMessage
import com.blackcat.text.entity.MessageEntity
import com.blackcat.text.repository.MessageRepository
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class ChatController(private val messageRepository: MessageRepository) {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    fun sendMessage(@Payload chatMessage: ChatMessage): ChatMessage {
        // Lưu tin nhắn vào Database trước khi broadcast
        messageRepository.save(
            MessageEntity(
                sender = chatMessage.sender,
                content = chatMessage.content
            )
        )
        return chatMessage
    }
}