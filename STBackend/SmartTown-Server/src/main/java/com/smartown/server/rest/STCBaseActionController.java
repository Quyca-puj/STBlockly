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

import com.smartown.server.model.STBaseAction;
import com.smartown.server.model.dto.STBaseActionDTO;
import com.smartown.server.services.ISTBaseActionService;

@RestController
@RequestMapping("command")
public class STCBaseActionController {

	
	@Autowired
	private ISTBaseActionService commandService;
	
	
	@GetMapping("/all")
	List<STBaseActionDTO> getAllCommands(){
		List<STBaseActionDTO> retList = new ArrayList<>();
		List<STBaseAction> commands = commandService.getAllBaseActions();
		ModelMapper mapper=new ModelMapper();
		if(commands!=null) {
			commands.forEach(command->{
				retList.add(mapper.map(command, STBaseActionDTO.class));
			});
		}

		return retList;
	}
	
	
	
	@PostMapping("/new")
	STBaseActionDTO createNewCommand(@RequestBody STBaseAction command){
		
		STBaseAction savedCommand = commandService.createBaseAction(command);
		ModelMapper mapper=new ModelMapper();
		STBaseActionDTO sendCommand = mapper.map(savedCommand, STBaseActionDTO.class);
		return sendCommand;
	}
	
}
