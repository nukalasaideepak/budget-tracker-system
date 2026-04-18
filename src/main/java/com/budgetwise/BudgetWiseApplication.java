package com.budgetwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = "com.budgetwise")
@EntityScan(basePackages = "com.budgetwise.model")
@EnableJpaRepositories(basePackages = "com.budgetwise.repository")
@EnableScheduling
public class BudgetWiseApplication {

	public static void main(String[] args) {
		SpringApplication.run(BudgetWiseApplication.class, args);
	}

}
