export interface I_start{
	start:int
}

export interface I_end{
	end:int
}

export interface I_data<T=any>{
	data:T
}

export interface I_Segment<T> extends
	I_start, I_end, I_data<T>{
}
