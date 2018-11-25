namespace DatingApp.API.Helpers
{
    public class UserParams
    {
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize;}
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value;}
        }
        public int UserId { get; set; }
        public string LookingFor { get; set; }
        private int minAge = 18;
        public int MinAge
        {
            get { return minAge;}
            set { minAge = (value < MinAge) ? MinAge : value;}
        }
        
        private int maxAge = 99;
        public int MaxAge
        {
            get { return maxAge;}
            set { maxAge = (value > MaxAge) ? MaxAge : value;}
        }
        public string OrderBy { get; set; }

        const int MaxPageSize = 50;
        
    }
}