package jobs

type Job struct {
	ID			int			`json:"id"`
	Company		string		`json:"company"`
	Position	string		`json:"position"`
	Period		string		`json:"period"`
	Bullets 	[]string	`json:"bullets"`
	Tags		[]string	`json:"tags,omitempty"`
}

