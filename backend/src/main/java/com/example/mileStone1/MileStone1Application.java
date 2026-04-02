package com.example.mileStone1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.mileStone1")
@EntityScan(basePackages = "com.example.mileStone1.model")
@EnableJpaRepositories(basePackages = "com.example.mileStone1.repository")
@EnableScheduling
public class MileStone1Application {

	public static void main(String[] args) {
		SpringApplication.run(MileStone1Application.class, args);
	}

}