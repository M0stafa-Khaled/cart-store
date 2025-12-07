const ReviewsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">
          Manage and moderate customer reviews
        </p>
      </div>
    </div>
  );
};

export default ReviewsHeader;
