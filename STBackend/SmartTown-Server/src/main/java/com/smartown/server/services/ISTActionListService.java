package com.smartown.server.services;

import java.util.List;

import com.smartown.server.model.STActionList;
import com.smartown.server.model.dto.STActionListDTO;

public interface ISTActionListService {
	
	List<STActionList> getAllActionLists();
	
	STActionList createActionList(STActionList aList);

	STActionList createFromDTO(STActionListDTO in);

	STActionList updateActionList(STActionList newAList);
}
