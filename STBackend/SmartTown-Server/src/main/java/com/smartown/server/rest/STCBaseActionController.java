package com.smartown.server.rest;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartown.server.model.STCommand;
import com.smartown.server.model.dto.STCommandDTO;
import com.smartown.server.services.ISTCommandService;

@RestController
@RequestMapping("command")
public class STCommandController {

	
	@Autowired
	private ISTCommandService commandService;
	
	
	@GetMapping("/all")
	List<STCommandDTO> getAllCommands(){
		List<STCommandDTO> retList = new ArrayList<>();
		List<STCommand> commands = commandService.getAllCommands();
		ModelMapper mapper=new ModelMapper();
		if(commands!=null) {
			commands.forEach(command->{
				retList.add(mapper.map(command, STCommandDTO.class));
			});
			
		}

		return retList;
	}
	
	
	
	@PostMapping("/new")
	STCommandDTO createNewCommand(@RequestBody STCommand command){
		
		STCommand savedCommand = commandService.createCommand(command);
		ModelMapper mapper=new ModelMapper();
		STCommandDTO sendCommand = mapper.map(savedCommand, STCommandDTO.class);
		return sendCommand;
	}
	
}
